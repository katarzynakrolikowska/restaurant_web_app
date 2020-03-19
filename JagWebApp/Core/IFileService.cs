using JagWebApp.Core.Models.Helpers;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace JagWebApp.Core
{
    public interface IFileService
    {
        Task<string> SaveFile(IFormFile file, string root, ImageDimensions dimensions = null);

        void RemoveFile(string fileName, string root);
    }
}