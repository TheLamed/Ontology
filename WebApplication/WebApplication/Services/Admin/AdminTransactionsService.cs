﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication.Models;
using WebApplication.Models.Entities;

namespace WebApplication.Services.Admin
{
    public class AdminTransactionsService
    {
        #region Theme

        public string AddTheme()
        {
            return "CREATE (n:Theme) " +
                "SET n.name = $Name " +
                "RETURN n ";
        }
        public string UpdateTheme()
        {
            return "MATCH (n:Theme) " +
                "WHERE id(n) = {0} " +
                "SET n.name = $Name " +
                "RETURN n ";
        }
        public string DeleteTheme()
        {
            return "MATCH (n:Theme) " +
                "WHERE id(n) = {0} " +
                "DETACH DELETE n ";
        }

        #endregion

        #region Term

        public string AddTerm(TermModel model)
        {
            var str = "CREATE (n:Term) " +
                "SET n.name = $Name " +
                ", n.description = $Description " +
                ", n.isFullMatch = $IsFullMatch " +
                $", n.status = {(int)Status.New} ";

            if (model.Source != null) 
                str += ", n.source = $Source ";
            
            str += "RETURN n ";

            return str;
        }
        public string AddThemeToTerm()
        {
            return "MATCH (r:Term) WHERE id(r) = {0} " +
                "MATCH (t:Theme) WHERE id(t) = {1} " +
                "CREATE (r)-[m:Member]->(t) " +
                "RETURN m ";
        }
        public string DeleteThemeFromTerm()
        {
            return "MATCH (r:Term)-[m]-(t:Theme) WHERE id(r) = {0} AND id(t) = {1} DELETE m ";
        }
        public string UpdateTerm()
        {
            return "MATCH(n:Term) " +
                "WHERE id(n) = {0} " +
                "SET n.name = $Name " +
                ", n.description = $Description " +
                ", n.isFullMatch = $IsFullMatch " + 
                ", n.source = $Source " +
                $", n.status = {(int)Status.New} " +
                "RETURN n ";
        }
        public string UpdateTermStatus()
        {
            return "MATCH(n:Term) " +
                "WHERE id(n) = {0} " +
                "SET n.status = {1} "; ;
        }
        public string DetachTerm()
        {
            return "MATCH (n:Term)-[r]-(:Term) " +
                "WHERE id(n) = {0} " +
                "DELETE r ";
        }
        public string DeleteTerm()
        {
            return "MATCH (n:Term) " +
                "WHERE id(n) = {0} " +
                "DETACH DELETE n ";
        }

        #endregion

        #region Binding

        public string GetUnindexedTerms()
        {
            return $"MATCH (n:Term) WHERE n.status = {(int)Status.New} RETURN n";
        }

        public string GetOtherTerms()
        {
            return "MATCH (n:Term) WHERE id(n) <> {0} RETURN n";
        }

        public string AddUsed()
        {
            return "MATCH (r:Term) WHERE id(r) = {0} " +
                "MATCH (t:Term) WHERE id(t) = {1} " +
                "CREATE (r)-[m:Used]->(t) " +
                "RETURN m ";
        }

        public string IsRelation()
        {
            return "MATCH (n:Term)-[r]->(t:Term) " +
                "WHERE id(n) = {0} AND id(t) = {1} " +
                "RETURN COUNT(r) > 0";
        }

        #endregion
    }
}
