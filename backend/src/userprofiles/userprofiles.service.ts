import { Injectable, Logger } from '@nestjs/common';
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
    if (await this.userProfileRepository.findOneBy({ _id: up._id })) {
      Logger.debug('update UserProfile', up._id);
      const updateResult = await this.userProfileRepository.update(
        { _id: up._id },
        up,
      );
      if (updateResult && updateResult.affected && updateResult.affected! > 0)
        return up;
      else {
        const err = 'Cannot update address ' + up._id;
        Logger.error(err);
        return new Promise((resolve, reject) => reject(err));
      }
    } else {
      Logger.debug('insert UserProfile', up._id);
      const insertResult = await this.userProfileRepository.insert(up);
      if (insertResult) return up;
      else {
        const err = 'Cannot update address ' + up._id;
        Logger.error(err);
        return new Promise((resolve, reject) => reject(err));
      }
    }
  }
}
