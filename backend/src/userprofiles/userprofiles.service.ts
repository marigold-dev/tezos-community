import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SOCIAL_ACCOUNT_TYPE, UserProfile } from './UserProfile';

@Injectable()
export class UserProfilesService {
  constructor(
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
  ) {}

  getUserProfile(address: string): Promise<UserProfile | null> {
    return this.userProfileRepository.findOneBy({ _id: address });
  }

  async getUserProfileFromSocialAccount(
    socialAccountType: SOCIAL_ACCOUNT_TYPE,
    socialAccountAlias: string,
  ): Promise<UserProfile | null> {
    return this.userProfileRepository.findOneBy({
      socialAccountAlias: socialAccountAlias,
      socialAccountType: socialAccountType,
    });
  }

  async save(up: UserProfile): Promise<UserProfile> {
    const updateResult = await this.userProfileRepository.update(
      { _id: up._id },
      up,
    );
    if (updateResult && updateResult.affected && updateResult.affected! > 0)
      return up;
    else
      return new Promise((resolve, reject) =>
        reject('Cannot update address ' + up._id),
      );
  }
}
