using System.IO;
using System.Linq;

namespace JagWebApp.Core.Models.Helpers
{
    public class PhotoSettings
    {
        public int MaxBytes { get; set; }

        public string[] AcceptedFileTypes { get; set; }

        public bool IsSupported(string fileName)
        {
            return AcceptedFileTypes.Any(t => Path.GetExtension(fileName).ToLower() == t);
        }
    }
}
