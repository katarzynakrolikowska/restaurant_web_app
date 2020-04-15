using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace JagWebApp.Tests.Mocks
{
    class ObjectModelValidatorMock
    {
        public static void SetObjectValidator(ControllerBase controller)
        {
            var objectValidator = new Mock<IObjectModelValidator>();
            objectValidator.Setup(o => o.Validate(It.IsAny<ActionContext>(),
                                              It.IsAny<ValidationStateDictionary>(),
                                              It.IsAny<string>(),
                                              It.IsAny<object>()));

            controller.ObjectValidator = objectValidator.Object;
        }
    }
}
