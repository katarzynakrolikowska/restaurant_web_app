using Microsoft.EntityFrameworkCore.Migrations;

namespace JagWebApp.Migrations
{
    public partial class UpdateDishesToHaveMultiplePhotos : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Dishes_Photos_PhotoId",
                table: "Dishes");

            migrationBuilder.DropIndex(
                name: "IX_Dishes_PhotoId",
                table: "Dishes");

            migrationBuilder.DropColumn(
                name: "PhotoId",
                table: "Dishes");

            migrationBuilder.AddColumn<int>(
                name: "DishId",
                table: "Photos",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Photos_DishId",
                table: "Photos",
                column: "DishId");

            migrationBuilder.AddForeignKey(
                name: "FK_Photos_Dishes_DishId",
                table: "Photos",
                column: "DishId",
                principalTable: "Dishes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Photos_Dishes_DishId",
                table: "Photos");

            migrationBuilder.DropIndex(
                name: "IX_Photos_DishId",
                table: "Photos");

            migrationBuilder.DropColumn(
                name: "DishId",
                table: "Photos");

            migrationBuilder.AddColumn<int>(
                name: "PhotoId",
                table: "Dishes",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Dishes_PhotoId",
                table: "Dishes",
                column: "PhotoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Dishes_Photos_PhotoId",
                table: "Dishes",
                column: "PhotoId",
                principalTable: "Photos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
