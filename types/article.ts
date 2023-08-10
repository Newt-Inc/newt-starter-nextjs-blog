import type { Content, Media } from 'newt-client-js'
import type { Author } from '@/types/author'
import type { Tag } from '@/types/tag'

export interface Article extends Content {
  title: string
  slug: string
  meta?: {
    title?: string
    description?: string
    ogImage?: Media
  }
  body: string
  coverImage: Media
  author: Author
  tags?: Tag[]
}

export interface Archive {
  year: number
  count: number
}
