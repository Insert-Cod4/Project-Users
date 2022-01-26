using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Project1.Data.Models
{
    public class User
    {


        /// <summary>
        /// The id and primary key 
        /// </summary>
        [Key]
        [Required]
        public int UsersId { get; set; }

        /// <summary>
        /// Users: name
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Users: Mother's Last name
        /// </summary>
        public string MoLastName { get; set; }
        
        /// <summary>
        /// Users: Father's Last name
        /// </summary>
        public string FaLastName { get; set; }

        /// <summary>
        /// Users: Address
        /// </summary>
        public string Address { get; set; }

        /// <summary>
        /// Users: Phone
        /// </summary>
        public string Pnumber { get; set; }






    }
}
