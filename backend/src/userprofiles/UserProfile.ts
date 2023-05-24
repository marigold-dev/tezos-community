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
  photo: string;

  constructor(
    address: string,
    displayName: string,
    socialAccountType: SOCIAL_ACCOUNT_TYPE,
    socialAccountAlias: string,
    photo: string,
  ) {
    this._id = address;
    this.displayName = displayName;
    this.photo = photo;
    this.socialAccountAlias = socialAccountAlias;
    this.socialAccountType = socialAccountType;
  }
}

export enum SOCIAL_ACCOUNT_TYPE {
  GOOGLE = 'google',
  TWITTER = 'twitter',
  FACEBOOK = 'facebook',
}
