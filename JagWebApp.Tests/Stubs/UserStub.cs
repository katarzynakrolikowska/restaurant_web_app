using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Security.Principal;

namespace JagWebApp.Tests.Stubs
{
    class UserStub
    {
        public static void SetUser(int? id, ControllerBase controller)
        {
            var identity = new GenericIdentity("", "");
            var nameIdentifierClaim = new Claim(ClaimTypes.NameIdentifier, id.ToString());
            identity.AddClaim(nameIdentifierClaim);

            var fakeUser = new GenericPrincipal(identity, roles: new string[] { });
            var context = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = fakeUser
                }
            };

            controller.ControllerContext = context;
        }
    }
}
