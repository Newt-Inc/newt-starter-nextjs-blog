import type { Content } from 'newt-client-js'

export interface Tag extends Content {
  name: string
  slug: string
}

export interface TagWithCount extends Tag {
  count: number
}
