using JagWebApp.Core;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Drawing;
using System.IO;

namespace JagWebApp.Persistence
{
    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _host;

        public FileService(IWebHostEnvironment host)
        {
            _host = host;
        }

        public string SaveFile(IFormFile file, string root)
        {
            var uploadFolderPath = Path.Combine(_host.WebRootPath, root);

            if (!Directory.Exists(uploadFolderPath))
                Directory.CreateDirectory(uploadFolderPath);

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadFolderPath, fileName);


            using (var memoryStream = new MemoryStream())
            {
                using var img = Image.FromStream(file.OpenReadStream());
                img.Save(filePath);
            }

            return fileName;
        }

        public void RemoveFile(string fileName, string root)
        {
            var uploadFolderPath = Path.Combine(_host.WebRootPath, root);
            var filePath = Path.Combine(uploadFolderPath, fileName);

            if (File.Exists(filePath))
                File.Delete(filePath);
        }
    }
}
