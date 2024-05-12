using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Talent.Common.Aws;
using Talent.Common.Contracts;

namespace Talent.Common.Services
{
    public class FileService : IFileService
    {
        private readonly IHostingEnvironment _environment;
        private readonly string _bucketName;
        private readonly string _tempFolder;
        private IAwsService _awsService;

        public FileService(IHostingEnvironment environment, 
            IAwsService awsService)
        {
            _environment = environment;
            _bucketName = "talent-advanced-bucket";
            _tempFolder = "images\\";
            _awsService = awsService;
        }

        public async Task<string> GetFileURL(string id, FileType type)
        {
            try
            {
                string objectKey = id;
                string fileUrl = await _awsService.GetStaticUrl(objectKey, _bucketName);
                return fileUrl;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw;
            }
        }

        public async Task<string> SaveFile(IFormFile file, FileType type)
        {
            if (file == null || file.Length == 0 || !file.ContentType.StartsWith("image/"))
            {
                throw new ArgumentException("Invalid file.");
            }

            try
            {
                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                using (MemoryStream memoryStream = new MemoryStream())
                {
                    await file.CopyToAsync(memoryStream);
                    memoryStream.Position = 0;
                    bool uploadSuccess = await _awsService.PutFileToS3(fileName, memoryStream, _bucketName, isPublic: true);

                    if (!uploadSuccess)
                    {
                        throw new Exception("Failed to upload file to S3.");
                    }
                }
                return fileName;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw;
            }
           
        }

        public async Task<bool> DeleteFile(string id, FileType type)
        {
            try
            {
                if (!string.IsNullOrEmpty(id))
                {
                    string objectKey = id;
                    bool deletionSuccess = await _awsService.RemoveFileFromS3(objectKey, _bucketName);
                    return deletionSuccess;
                }
                return false;
              
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw;
            }
        }


        #region Document Save Methods

        private async Task<string> SaveFileGeneral(IFormFile file, string bucket, string folder, bool isPublic)
        {
            //Your code here;
            throw new NotImplementedException();
        }
        
        private async Task<bool> DeleteFileGeneral(string id, string bucket)
        {
            //Your code here;
            throw new NotImplementedException();
        }
        #endregion
    }
}
