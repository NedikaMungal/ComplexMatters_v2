using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Helpers;

namespace API.Interfaces
{
public interface ILikesRepository
 {
     Task<UserLike?> GetUserLike(int sourceUserId, int targetUserId);
    // Task<PagedList<MemberDto>> GetUserLikes(LikesParams likesParams);
     Task<IEnumerable<int>> GetCurrentUserLikeIds(int currentUserId);
     void DeleteLike(UserLike like);
     void AddLike(UserLike like);
     Task<bool> SaveChanges();
 }
}