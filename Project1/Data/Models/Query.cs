using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GraphQL.Types;
using Project1.Data.Models;
using Microsoft.EntityFrameworkCore;
using GraphQL;
using HotChocolate;
using HotChocolate.Data;
namespace Project1.Data.Models
{
    public class Query
    {
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<User> GetUsers([Service] ApplicationDbContext context) => context.Users;
            //new List<User>().AsQueryable();




    }
}
