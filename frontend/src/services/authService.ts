import { initializeApp } from 'firebase/app'
import type { FirebaseApp } from 'firebase/app'
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged
} from 'firebase/auth'
import type { Auth, User } from 'firebase/auth'
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs
} from 'firebase/firestore'
import type { Firestore } from 'firebase/firestore'

// Firebase Configuration
// This is a placeholder config. Replace with your actual Firebase Web App config from Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBJ4d8Z-LFGJzk8QJ-WyUZ8eN2zMqk-XY8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "pwd-profile-db.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "pwd-profile-db",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "pwd-profile-db.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "100190608834255839110",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:100190608834255839110:web:a1b2c3d4e5f6g7h8i9j0k1"
}

let app: FirebaseApp | undefined
let auth: Auth | undefined
let db: Firestore | undefined
let initError: Error | null = null
let initAttempted = false

// Initialize Firebase with error handling
function initializeFirebase() {
  // If we've already tried and failed, return the error
  if (initError) throw initError

  // If already initialized successfully, return instances
  if (app && auth && db) {
    return { app, auth, db }
  }

  // If initialization is already in progress, wait
  if (initAttempted && !app) {
    throw initError || new Error('Firebase initialization in progress')
  }

  if (!app) {
    try {
      initAttempted = true
      console.log('Initializing Firebase with config:', {
        projectId: firebaseConfig.projectId,
        authDomain: firebaseConfig.authDomain,
        hasApiKey: Boolean(firebaseConfig.apiKey),
      })

      if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes('YOUR_') || firebaseConfig.apiKey.length < 20) {
        throw new Error(
          'Firebase API key is invalid or missing. Set VITE_FIREBASE_API_KEY in frontend/.env with your Firebase Web API key.'
        )
      }

      app = initializeApp(firebaseConfig)
      auth = getAuth(app)
      db = getFirestore(app)

      // Set persistence
      setPersistence(auth, browserLocalPersistence).catch(error => {
        console.warn('Persistence setup warning:', error?.message)
      })

      console.log('Firebase initialized successfully')
    } catch (error: any) {
      initError = error
      console.error('Firebase initialization failed:', error?.message || error)
      throw error
    }
  }

  if (!auth || !db) {
    const err = new Error('Firebase instances not properly initialized')
    initError = err
    throw err
  }

  return { app, auth, db }
}

export interface UserRole {
  role: 'super-admin' | 'administrator' | 'worker'
  displayName: string
}

export interface AuthUser extends User {
  userRole?: UserRole
}

// Sign up a new user
export async function signUpUser(
  email: string,
  password: string,
  displayName: string,
  role: 'administrator' | 'worker'
): Promise<{ uid: string; email: string }> {
  const { auth: authInstance, db: dbInstance } = initializeFirebase()

  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(authInstance, email, password)
    const user = userCredential.user

    // Store user role in Firestore
    await setDoc(doc(dbInstance, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName,
      role,
      createdAt: new Date().toISOString(),
      status: 'active'
    })

    return {
      uid: user.uid,
      email: user.email || ''
    }
  } catch (error: any) {
    console.error('Sign up error:', error)
    throw new Error(error.message || 'Failed to create user account')
  }
}

// Login user
export async function loginUser(email: string, password: string): Promise<AuthUser> {
  const { auth: authInstance, db: dbInstance } = initializeFirebase()

  try {
    const userCredential = await signInWithEmailAndPassword(authInstance, email, password)
    const user = userCredential.user

    // Get user role from Firestore
    const userDoc = await getDoc(doc(dbInstance, 'users', user.uid))
    const userData = userDoc.data()

    if (!userData) {
      throw new Error('User data not found. Contact administrator.')
    }

    if (userData.status !== 'active') {
      throw new Error('User account is inactive. Contact administrator.')
    }

    return {
      ...user,
      userRole: {
        role: userData.role as 'super-admin' | 'administrator' | 'worker',
        displayName: userData.displayName
      }
    }
  } catch (error: any) {
    console.error('Login error:', error)
    throw new Error(error.message || 'Invalid email or password')
  }
}

// Sign out user
export async function logoutUser(): Promise<void> {
  const { auth: authInstance } = initializeFirebase()

  try {
    await firebaseSignOut(authInstance)
  } catch (error: any) {
    console.error('Logout error:', error)
    throw new Error(error.message || 'Failed to logout')
  }
}

// Get current user with role
export function getCurrentUser(): AuthUser | null {
  try {
    const { auth: authInstance } = initializeFirebase()
    const user = authInstance.currentUser
    if (!user) return null
    return user as AuthUser
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Watch auth state changes
export function watchAuthState(callback: (user: AuthUser | null) => void) {
  try {
    const { auth: authInstance, db: dbInstance } = initializeFirebase()

    const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(dbInstance, 'users', user.uid))
          const userData = userDoc.data()

          const authUser: AuthUser = {
            ...user,
            userRole: userData ? {
              role: userData.role as 'super-admin' | 'administrator' | 'worker',
              displayName: userData.displayName
            } : undefined
          }
          callback(authUser)
        } catch (error) {
          console.error('Error fetching user data:', error)
          callback(user as AuthUser)
        }
      } else {
        callback(null)
      }
    })

    return unsubscribe
  } catch (error) {
    console.error('Error setting up auth state watch:', error)
    // Call the callback with null to unblock the loading screen
    callback(null)
    // Return a no-op unsubscribe function
    return () => { }
  }
}

// Get all users (for super admin)
export async function getAllUsers(): Promise<any[]> {
  const { db: dbInstance } = initializeFirebase()

  try {
    const usersCollection = collection(dbInstance, 'users')
    const snapshot = await getDocs(usersCollection)
    return snapshot.docs.map(doc => doc.data())
  } catch (error: any) {
    console.error('Error fetching users:', error)
    throw new Error(error.message || 'Failed to fetch users')
  }
}

// Get auth instance
export function getAuthInstance() {
  const { auth: authInstance } = initializeFirebase()
  return authInstance
}

// Get firestore instance
export function getFirestoreInstance() {
  const { db: dbInstance } = initializeFirebase()
  return dbInstance
}
