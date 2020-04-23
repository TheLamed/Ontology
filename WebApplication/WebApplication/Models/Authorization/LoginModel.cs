using System.ComponentModel.DataAnnotations;

namespace WebApplication.Models.Authorization
{
    public class LoginModel
    {
        [Required]
        public string Login { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
