using Microsoft.EntityFrameworkCore.Migrations;

namespace JagWebApp.Migrations
{
    public partial class AddDishesPhotos : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PhotoId",
                table: "Dishes",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Photos",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(maxLength: 255, nullable: false),
                    ThumbnailName = table.Column<string>(maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Photos", x => x.Id);
                });

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

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Dishes_Photos_PhotoId",
                table: "Dishes");

            migrationBuilder.DropTable(
                name: "Photos");

            migrationBuilder.DropIndex(
                name: "IX_Dishes_PhotoId",
                table: "Dishes");

            migrationBuilder.DropColumn(
                name: "PhotoId",
                table: "Dishes");
        }
    }
}
