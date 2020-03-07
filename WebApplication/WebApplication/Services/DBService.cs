using Microsoft.Extensions.Configuration;
using Neo4j.Driver.V1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication.Services
{
    public class DBService
    {
        public IDriver _driver;

        public IConfiguration _configuration;

        public DBService(IConfiguration configuration)
        {
            _configuration = configuration;

            _driver = GraphDatabase.Driver(
                configuration["DB:URI"], 
                AuthTokens.Basic(
                    configuration["DB:Username"], 
                    configuration["DB:Password"]
                )
            );
        }

        public ISession GetSession()
        {
            return _driver.Session();
        }
    }
}
