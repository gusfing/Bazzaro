// Production authentication service
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  UserCredential,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';
import { auth } from './firebase';
import { createCustomer, getCustomerByUid } from './store';
import { productionEmailService } from './emailService';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

class AuthService {
  private googleProvider: GoogleAuthProvider;

  constructor() {
    this.googleProvider = new GoogleAuthProvider();
    this.googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
  }

  // Email/Password Authentication
  async signUp(data: SignUpData): Promise<AuthUser> {
    if (!auth) {
      throw new Error('Firebase Auth not initialized');
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        data.email, 
        data.password
      );

      // Update user profile
      await updateProfile(userCredential.user, {
        displayName: `${data.firstName} ${data.lastName}`
      });

      // Create customer profile in database
      await createCustomer({
        uid: userCredential.user.uid,
        email: data.email,
        name: `${data.firstName} ${data.lastName}`,
        phone: data.phone
      });

      // Send welcome email
      await productionEmailService.sendWelcomeEmail(
        data.email,
        `${data.firstName} ${data.lastName}`
      );

      return this.formatUser(userCredential.user);
    } catch (error: any) {
      console.error('Sign up failed:', error);
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  async signIn(data: SignInData): Promise<AuthUser> {
    if (!auth) {
      throw new Error('Firebase Auth not initialized');
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      return this.formatUser(userCredential.user);
    } catch (error: any) {
      console.error('Sign in failed:', error);
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  // Google Authentication
  async signInWithGoogle(): Promise<AuthUser> {
    if (!auth) {
      throw new Error('Firebase Auth not initialized');
    }

    try {
      const userCredential = await signInWithPopup(auth, this.googleProvider);
      const user = userCredential.user;

      // Check if customer profile exists, create if not
      const existingCustomer = await getCustomerByUid(user.uid);
      if (!existingCustomer) {
        await createCustomer({
          uid: user.uid,
          email: user.email!,
          name: user.displayName || 'Google User',
          phone: user.phoneNumber || undefined
        });

        // Send welcome email for new users
        if (user.email) {
          await productionEmailService.sendWelcomeEmail(
            user.email,
            user.displayName || 'Valued Customer'
          );
        }
      }

      return this.formatUser(user);
    } catch (error: any) {
      console.error('Google sign in failed:', error);
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  // Phone Authentication
  async setupRecaptcha(containerId: string): Promise<RecaptchaVerifier> {
    if (!auth) {
      throw new Error('Firebase Auth not initialized');
    }

    return new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        console.log('reCAPTCHA solved');
      }
    });
  }

  async signInWithPhone(
    phoneNumber: string, 
    recaptchaVerifier: RecaptchaVerifier
  ): Promise<ConfirmationResult> {
    if (!auth) {
      throw new Error('Firebase Auth not initialized');
    }

    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaVerifier
      );

      return confirmationResult;
    } catch (error: any) {
      console.error('Phone sign in failed:', error);
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  async verifyPhoneCode(
    confirmationResult: ConfirmationResult,
    code: string
  ): Promise<AuthUser> {
    try {
      const userCredential = await confirmationResult.confirm(code);
      const user = userCredential.user;

      // Check if customer profile exists, create if not
      const existingCustomer = await getCustomerByUid(user.uid);
      if (!existingCustomer) {
        await createCustomer({
          uid: user.uid,
          email: user.email || '',
          name: user.displayName || 'Phone User',
          phone: user.phoneNumber || undefined
        });
      }

      return this.formatUser(user);
    } catch (error: any) {
      console.error('Phone verification failed:', error);
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  // Password Reset
  async resetPassword(email: string): Promise<void> {
    if (!auth) {
      throw new Error('Firebase Auth not initialized');
    }

    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error('Password reset failed:', error);
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  // Sign Out
  async signOut(): Promise<void> {
    if (!auth) {
      throw new Error('Firebase Auth not initialized');
    }

    try {
      await signOut(auth);
    } catch (error: any) {
      console.error('Sign out failed:', error);
      throw new Error('Failed to sign out');
    }
  }

  // Update Profile
  async updateUserProfile(updates: {
    displayName?: string;
    photoURL?: string;
  }): Promise<void> {
    if (!auth?.currentUser) {
      throw new Error('No authenticated user');
    }

    try {
      await updateProfile(auth.currentUser, updates);

      // Update customer profile in database
      if (updates.displayName) {
        await createCustomer({
          uid: auth.currentUser.uid,
          email: auth.currentUser.email!,
          name: updates.displayName
        });
      }
    } catch (error: any) {
      console.error('Profile update failed:', error);
      throw new Error('Failed to update profile');
    }
  }

  // Get Current User
  getCurrentUser(): User | null {
    return auth?.currentUser || null;
  }

  // Format user data
  private formatUser(user: User): AuthUser {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      phoneNumber: user.phoneNumber,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    };
  }

  // Error message mapping
  private getAuthErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
      'auth/user-not-found': 'No account found with this email address.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/invalid-email': 'Invalid email address.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'auth/popup-closed-by-user': 'Sign-in popup was closed.',
      'auth/cancelled-popup-request': 'Sign-in was cancelled.',
      'auth/invalid-phone-number': 'Invalid phone number format.',
      'auth/invalid-verification-code': 'Invalid verification code.',
      'auth/code-expired': 'Verification code has expired.',
      'auth/missing-verification-code': 'Please enter the verification code.',
      'auth/quota-exceeded': 'SMS quota exceeded. Please try again later.',
      'auth/operation-not-allowed': 'This sign-in method is not enabled.'
    };

    return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!auth?.currentUser;
  }

  // Get user token for API calls
  async getIdToken(): Promise<string | null> {
    if (!auth?.currentUser) {
      return null;
    }

    try {
      return await auth.currentUser.getIdToken();
    } catch (error) {
      console.error('Failed to get ID token:', error);
      return null;
    }
  }
}

export const authService = new AuthService();

// Auth state observer
export function onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
  if (!auth) {
    callback(null);
    return () => {};
  }

  return auth.onAuthStateChanged((user) => {
    callback(user ? authService['formatUser'](user) : null);
  });
}

// Check if Firebase Auth is configured
export function isAuthConfigured(): boolean {
  return !!auth;
}