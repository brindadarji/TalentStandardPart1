using Talent.Services.Profile.Models.Profile;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Talent.Services.Profile.Models;
using Talent.Common.Models;
using Microsoft.AspNetCore.Http;

namespace Talent.Services.Profile.Domain.Contracts
{
    public interface IProfileService
    {
        Task<AddSkillViewModel> AddNewSkill(AddSkillViewModel skill, string currentUserId);

        Task<bool> DeleteSkill(string id, string currentUserId);

        Task<bool> EditSkill(AddSkillViewModel skill, string id, string currentUserId);

        Task<AddLanguageViewModel> AddNewLanguage(AddLanguageViewModel language, string currentUserId);

        Task<bool> DeleteLanguage(string id, string currentUserId);

        Task<bool> EditLanguage(AddLanguageViewModel language, string id, string currentUserId);

        Task<ExperienceViewModel> AddNewExperience(ExperienceViewModel experience, string currentUserId);

        Task<bool> DeleteExperience(string id, string currentUserId);

        Task<bool> EditExperience(ExperienceViewModel experience, string id, string currentUserId);

        Task<TalentProfileViewModel> GetTalentProfile(String Id);
        Task<IEnumerable<string>> GetTalentSuggestionIds(string employerOrJobId, bool forJob, int position, int increment);
        Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(string employerOrJobId, bool forJob, int position, int increment);
        Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(IEnumerable<string> ids);

        Task<bool> UpdateTalentProfile(TalentProfileViewModel profile, String updaterId);
        Task<bool> UpdateTalentPhoto(string talentId, IFormFile file);

        Task<bool> AddTalentVideo(string talentId, IFormFile file);
        Task<bool> RemoveTalentVideo(string talentId, string videoName);

        Task<EmployerProfileViewModel> GetEmployerProfile(String id, string role);

        Task<bool> UpdateEmployerProfile(EmployerProfileViewModel profile, String updaterId, string role);
        Task<bool> UpdateEmployerPhoto(string employerId, IFormFile file);

        Task<bool> AddEmployerVideo(string employerId, IFormFile file);
        Task<bool> AddTalentSuggestions(AddTalentSuggestionList selectedTalents);

        Task<bool> UpdateTalentCV(string talentId, IFormFile file);

        Task<IEnumerable<TalentSuggestionViewModel>> GetFullTalentList();
        IEnumerable<TalentMatchingEmployerViewModel> GetEmployerList();
        Task<IEnumerable<TalentMatchingEmployerViewModel>> GetEmployerListByFilterAsync(SearchCompanyModel model);
        Task<IEnumerable<TalentSuggestion>> GetSuggestionList(string employerOrJobId, bool forJob, string recruiterId);
        Task<IEnumerable<TalentSuggestionViewModel>> GetTalentListByFilterAsync(SearchTalentModel model);

        Task<IEnumerable<ClientViewModel>> GetClientListAsync(string recruiterId);
        Task<Employer> GetEmployer(string employerId);
    }
}
