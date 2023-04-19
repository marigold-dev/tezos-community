import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity('userprofile')
export class UserProfile {
  @ObjectIdColumn()
  _id: string;

  @Column()
  displayName: string;

  @Column()
  socialAccountType: SOCIAL_ACCOUNT_TYPE;

  @Column()
  socialAccountAlias: string;

  @Column()
  proof: string;

  @Column()
  proofDate: Date;

  @Column()
  verified: boolean;

  constructor(
    address: string,
    displayName: string,
    socialAccountType: SOCIAL_ACCOUNT_TYPE,
    socialAccountAlias: string,
  ) {
    this._id = address;
    this.displayName = displayName;
    this.verified = false;
    this.proof = '';
    this.socialAccountAlias = socialAccountAlias;
    this.socialAccountType = socialAccountType;
    this.proofDate = new Date();
  }
}

export enum SOCIAL_ACCOUNT_TYPE {
  GOOGLE = 'GOOGLE',
  TWITTER = 'TWITTER',
  WHATSAPP = 'WHATSAPP',
  FACEBOOK = 'FACEBOOK',
  DISCORD = 'DISCORD',
  TELEGRAM = 'TELEGRAM',
  SLACK = 'SLACK',
}
