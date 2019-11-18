using System;
using System.Collections.Generic;

namespace HolidayApp.Models
{
    public partial class Locations
    {
        public long Id { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public double Longitude { get; set; }
        public double Latitude { get; set; }
        public string Image { get; set; }
        public string Tripadvisor { get; set; }
    }
}
