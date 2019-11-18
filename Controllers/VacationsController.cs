using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HolidayApp.Models;

namespace HolidayApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VacationsController : ControllerBase
    {
        private readonly HolidayDBContext _context;

        public VacationsController(HolidayDBContext context)
        {
            _context = context;
        }

        // GET: api/Vacations/active/sample
        [HttpGet("active/{user}")]
        public async Task<ActionResult<Vacation>> GetVacationByUserActive(string user)
        {
            var userVacation = from a in _context.Vacation
                               join b in _context.Locations on a.Location equals b.City
                               where a.User == user && a.Isactive == true
                               select new { a.Id, locationid = b.Id, a.User, a.Startdate, a.Isactive, b.Country, b.City, b.Latitude, b.Longitude, b.Image, b.Tripadvisor };
            if (!userVacation.Any())
                return NotFound();
            return Ok(userVacation);
        }

        // GET: api/Vacations/5
        [HttpGet("{user}")]
        public async Task<ActionResult<Vacation>> GetVacationByUserAll(string user)
        {
            var userVacation = from a in _context.Vacation
                               join b in _context.Locations on a.Location equals b.City
                               where a.User == user
                               select new { a.Id, locationid = b.Id, a.User, a.Startdate, a.Isactive, b.Country, b.City, b.Latitude, b.Longitude, b.Image, b.Tripadvisor };
            if (!userVacation.Any())
                return NotFound();
            return Ok(userVacation);
        }

        // POST: api/Vacations
        [HttpPost]
        public async Task<ActionResult<Vacation>> PostVacation([FromBody]Vacation newItem)
        {
            var newVac = new Vacation { User = newItem.User, Location = newItem.Location, Startdate = newItem.Startdate, Isactive = true };
            _context.Vacation.Add(newVac);
            await _context.SaveChangesAsync();

            return Ok(newVac);
        }

        // POST: api/Vacations/disable
        [Route("disable")]
        [HttpPost]
        public async Task<ActionResult<Vacation>> NoVacation([FromBody]Vacation disableItem)
        {
            var userVacation = await _context.Vacation.FindAsync(disableItem.Id);
            if (userVacation == null)
                return NotFound();

            userVacation.Isactive = false;
            await _context.SaveChangesAsync();
            return Ok(userVacation);
        }
    }
}
