using JagWebApp.Core.Models.Helpers;
using Microsoft.AspNetCore.Http;

namespace JagWebApp.Core
{
    public interface IFileService
    {
        string SaveFile(IFormFile file, string root, ImageDimensions dimensions);

        void RemoveFile(string fileName, string root);
    }
}