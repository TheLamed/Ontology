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
        #region Private Members

        private IDriver _driver;

        private IConfiguration _configuration;

        #endregion

        #region Constructor

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

        #endregion

        #region Methods

        public ISession GetSession()
        {
            return _driver.Session();
        }

        #endregion
    }
}
