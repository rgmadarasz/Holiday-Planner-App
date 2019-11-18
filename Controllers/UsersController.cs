using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HolidayApp.Models;
using System.Net;

namespace HolidayApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly HolidayDBContext _context;

        public UsersController(HolidayDBContext context)
        {
            _context = context;
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Users>> GetUsers(long id)
        {
            var users = await _context.Users.FindAsync(id);

            if (users == null)
            {
                return NotFound();
            }

            return users;
        }

        // POST: api/Users
        [HttpPost]
        public async Task<ActionResult<Users>> PostUsers([FromBody]Users loginUser)
        {
            var user = from a in _context.Users
                       where a.Username == loginUser.Username && a.Password == loginUser.Password
                       select a;
            if (!user.Any())
                return NotFound();
            return Ok(user);
        }

        // POST: api/Users/register
        [Route("register")]
        [HttpPost]
        public async Task<ActionResult<Users>> RegisterUser([FromBody]Users newUser)
        {
            var user = from a in _context.Users
                       where a.Username == newUser.Username
                       select a;
            if (user.Any())
                return Conflict();
            
            newUser.Joindate = DateTime.UtcNow.Date;
            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();
            return Ok(user);
        }
    }
}
