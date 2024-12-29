
// Class representing a user
export class User {
  constructor(username, email) {
    this.username = username;
    this.email = email;
  }
}

// Class representing the authentication context type
export class AuthContextType {
  constructor(
    user = null,
    isLoggedIn = false,
    login = async () => {},
    logout = async () => {}
  ) {
    this.user = user;
    this.isLoggedIn = isLoggedIn;
    this.login = login;
    this.logout = logout;
  }
}