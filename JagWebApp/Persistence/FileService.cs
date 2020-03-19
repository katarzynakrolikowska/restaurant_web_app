using JagWebApp.Core;
using JagWebApp.Core.Models.Helpers;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Drawing;
using System.IO;
using System.Threading.Tasks;

namespace JagWebApp.Persistence
{
    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _host;

        public FileService(IWebHostEnvironment host)
        {
            _host = host;
        }

        public async Task<string> SaveFile(IFormFile file, string root, ImageDimensions dimensions = null)
        {
            var uploadFolderPath = Path.Combine(_host.WebRootPath, root);

            if (!Directory.Exists(uploadFolderPath))
                Directory.CreateDirectory(uploadFolderPath);

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadFolderPath, fileName);

            if (dimensions == null)
            {
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
            }
            else
            {
                using (var memoryStream = new MemoryStream())
                {
                    using (var img = Image.FromStream(file.OpenReadStream()))
                    {
                        Image image = GetResizedImage(img, dimensions.Width, dimensions.Height);
                        image.Save(filePath);
                    }
                }
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

        private Image GetResizedImage(Image image, int width, int height)
        {
            try
            {
                Image thumb = image.GetThumbnailImage(width, height, () => false, IntPtr.Zero);
                return thumb;
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}
