import { UserFieldInstances } from '@privy-io/privy-node'

export class Forum {
  constructor(
    public address: string,
    public forumName: string,
    public forumSlug: string,
    public forumAddress: string,
    public forumChain: string,
    public forumLogoUri: string
  ) {}

  static fromPrivyInstance(data: UserFieldInstances): Forum | null {
    if (!data) return null

    const getTextForField = (data: UserFieldInstances, id: string) =>
      /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
      (data.data || []).find((data) => data?.field_id === id)!.text()

    try {
      const forumName = getTextForField(data, 'forum-name')
      const forumSlug = getTextForField(data, 'forum-slug').toLowerCase()
      const forumAddress = getTextForField(data, 'forum-address')
      const forumChain = getTextForField(data, 'forum-chain')
      const forumLogoUri = getTextForField(data, 'forum-logo-uri')
      return new Forum(data.user_id, forumName, forumSlug, forumAddress, forumChain, forumLogoUri)
    } catch (e) {
      return null
    }
  }

  static fromObject(data: any): Forum | null {
    if (!data) return null

    return new Forum(
      data?.['address'] as string,
      data?.['forumName'] as string,
      data?.['forumSlug'] as string,
      data?.['forumAddress'] as string,
      data?.['forumChain'] as string,
      data?.['forumLogoUri'] as string
    )
  }

  static allFields(): string[] {
    return ['forum-name', 'forum-slug', 'forum-address', 'forum-chain', 'forum-logo-uri']
  }

  toJson(): object {
    return {
      address: this.address,
      forumName: this.forumName,
      forumSlug: this.forumSlug,
      forumAddress: this.forumAddress,
      forumChain: this.forumChain,
      forumLogoUri: this.forumLogoUri,
    }
  }
}
