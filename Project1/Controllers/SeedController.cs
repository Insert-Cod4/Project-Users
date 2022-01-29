using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Project1.Data;
using OfficeOpenXml;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Project1.Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using System.Security;

namespace Project1.Controllers
{   
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SeedController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;


        public SeedController(
            ApplicationDbContext context,
            IWebHostEnvironment env
            )
        {
            _context = context;
            _env = env;
        }


        [HttpGet]
        public async Task<ActionResult> Import()
        {
            if(!_env.IsDevelopment())
            {
                throw new SecurityException("Not allowed");
            }

            var path = Path.Combine(_env.ContentRootPath, "Data/Source/Name.xlsx");
        
            using var stream = System.IO.File.OpenRead(path);
            using var excelPackage = new ExcelPackage(stream);

            /// get the first worksheet
            var worksheet = excelPackage.Workbook.Worksheets[0];

            // Define how many rows we want to proccess
            var nEndRow = worksheet.Dimension.Rows;

            // Initialize the record counters
            var numberUsersAdded = 0;


            var usersByName = _context.Users
                .AsNoTracking()
                .ToDictionary(x => x.Name, StringComparer.OrdinalIgnoreCase); ;
            
            for(int nRow = 2; nRow <= nEndRow; nRow++)
            {
                var row = worksheet.Cells[nRow , 1 , nRow , worksheet.Dimension.End.Column];

                var name = row[nRow , 1 ].GetValue<string>();
                var molastname = row[nRow , 2 ].GetValue<string>();
                var falastname = row[nRow , 3 ].GetValue<string>();
                var address = row[nRow , 4 ].GetValue<string>();
                var pnumber = row[nRow , 5 ].GetValue<string>();

                if (usersByName.ContainsKey(name))
                    continue;

                var user = new User
                {
                    Name = name,
                    MoLastName = molastname,
                    FaLastName = falastname,
                    Address = address,
                    Pnumber = pnumber,
                };

                await _context.Users.AddAsync(user);

                usersByName.Add(name, user);

                numberUsersAdded++;
            }

            if (numberUsersAdded > 0) await _context.SaveChangesAsync();

            return new JsonResult(new
            {
                Users = numberUsersAdded
            });


        }


    }
}
