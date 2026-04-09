import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      username: string
      avatar: string
      email?: string | null
    }
  }

  interface User {
    id: string
    name: string
    username: string
    avatar: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    username: string
    avatar: string
  }
}
