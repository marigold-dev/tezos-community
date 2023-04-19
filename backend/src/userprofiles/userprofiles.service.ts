import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { Repository } from 'typeorm';
import { SOCIAL_ACCOUNT_TYPE, UserProfile } from './UserProfile';

@Injectable()
export class UserProfilesService {
  constructor(
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
  ) {}

  async generateProof(
    address: string,
    displayName: string,
    socialAccountAlias: string,
    socialAccountType: SOCIAL_ACCOUNT_TYPE,
  ): Promise<UserProfile> {
    let up = await this.userProfileRepository.findOneBy({ _id: address });

    if (!up) {
      up = new UserProfile(
        address,
        displayName,
        socialAccountType,
        socialAccountAlias,
      );
      await this.userProfileRepository.insert(up);
    }

    up.proof = randomBytes(16).toString('hex');
    up.proofDate = new Date();
    const updateResult = await this.userProfileRepository.update(
      { _id: address },
      up,
    );
    if (updateResult && updateResult.affected && updateResult.affected! > 0)
      return up;
    else
      return new Promise((resolve, reject) =>
        reject('Cannot update address ' + address + ' with new proof'),
      );
  }

  getUserProfile(address: string): Promise<UserProfile | null> {
    return this.userProfileRepository.findOneBy({ _id: address });
  }
}
