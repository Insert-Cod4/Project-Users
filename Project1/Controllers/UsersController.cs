using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project1.Data;
using Project1.Data.Models;

namespace Project1.Controllers
{   
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        //[Route("{pageIndex}/{pageSize?}")]
        public async Task<ActionResult<ApiResult<User>>> GetUsers(int pageIndex = 0 , int pageSize = 10 ,
            string sortColumn = null , string sortOrder = null , string filterColumn = null , string filterQuery = null)
        {   
            //var users = _context.Users;
            //if(!string.IsNullOrEmpty(filterColumn) && !string.IsNullOrEmpty(filterQuery))

            return await ApiResult<User>.CreateAsync( _context.Users, pageIndex, pageSize , sortColumn , sortOrder , filterColumn , filterQuery);
        }


        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if(user == null)
            {
                return NotFound();
            }
            return user;
        }



        [HttpPut("id")]
        public async Task<ActionResult> PutUser(int id , User user)
        {
            if(id != user.UsersId)
            {
                return BadRequest();
            }
            _context.Entry(user).State = EntityState.Modified;
            
            try
            {
                await _context.SaveChangesAsync();
            }

            catch(DbUpdateConcurrencyException)
            {
                if(!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }


        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = user.UsersId }, user);
        }





        [HttpDelete("delete/{id}")]
        public async Task<ActionResult<User>> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if(user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.UsersId == id);
        }


        [HttpPost]
        [Route("IsDupeUser")]
        public bool IsDupeUser(User user)
        {
            return _context.Users.Any(
                e => e.Name == user.Name
                && e.MoLastName == user.MoLastName
                && e.FaLastName == user.FaLastName
                && e.Address == user.Address
                && e.Pnumber == user.Pnumber
                && e.UsersId != user.UsersId
                );
        }


    }
}
