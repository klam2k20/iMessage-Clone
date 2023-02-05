import 'next-auth';

/**
 * The extension d.ts is a type declaration file
 * by attaching that to next-auth the typescript
 * compiler recognize the matching library names.
 * So all the types declared in this declaration file 
 * are going to be interpretted as actual types from
 * the next-auth library. This allows us to create and 
 * customize types directly from the next-auth library.
 * By using the declare module we can add and modify types
 * and intefaces that exist within the next-auth library
 */

declare module 'next-auth' {
  /**
   * The Session and User interface created here 
   * will be combined with the existing Session and
   * User interface in the next-auth library
   */
  interface Session {
    user: User;
  }

  interface User {
    id: string;
    username: string;
  }
}