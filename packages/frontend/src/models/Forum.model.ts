import { UserFieldInstances } from '@privy-io/privy-node'

export class Forum {
  constructor(public address: string, public forumName: string, public forumSlug: string) {}

  static fromPrivyInstance(data: UserFieldInstances): Forum | null {
    if (!data) return null

    const forumName = (data.data || []).find((data) => data?.field_id === 'forum-name')?.text()
    const forumSlug = (data.data || [])
      .find((data) => data?.field_id === 'forum-slug')
      ?.text()
      ?.toLowerCase()
    if (!forumName || !forumSlug) return null

    return new Forum(data.user_id, forumName, forumSlug)
  }

  static fromObject(data: any): Forum | null {
    if (!data) return null

    return new Forum(
      data?.['address'] as string,
      data?.['forumName'] as string,
      data?.['forumSlug'] as string
    )
  }

  toJson(): object {
    return {
      address: this.address,
      forumName: this.forumName,
      forumSlug: this.forumSlug,
    }
  }
}
