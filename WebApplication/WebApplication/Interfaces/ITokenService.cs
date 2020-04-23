﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication.Models.Entities;

namespace WebApplication.Interfaces
{
    public interface ITokenService
    {
        Task<string> GenerateToken(User user);
    }
}
