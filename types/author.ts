import type { Content, Media } from 'newt-client-js'

export interface Author extends Content {
  fullName: string
  slug: string
  biography: string
  profileImage?: Media
}
