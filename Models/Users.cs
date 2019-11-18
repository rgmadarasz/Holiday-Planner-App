using System;
using System.Collections.Generic;

namespace HolidayApp.Models
{
    public partial class Users
    {
        public long Userid { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public DateTime Joindate { get; set; }
    }
}
