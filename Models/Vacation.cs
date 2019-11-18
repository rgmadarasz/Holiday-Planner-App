using System;
using System.Collections.Generic;

namespace HolidayApp.Models
{
    public partial class Vacation
    {
        public long Id { get; set; }
        public string User { get; set; }
        public string Location { get; set; }
        public DateTime Startdate { get; set; }
        public bool? Isactive { get; set; }
    }
}
