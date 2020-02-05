using Microsoft.EntityFrameworkCore.Migrations;

namespace JagWebApp.Migrations
{
    public partial class AddDishesToMenuItem : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MenuItems_Dishes_DishId",
                table: "MenuItems");

            migrationBuilder.DropIndex(
                name: "IX_MenuItems_DishId",
                table: "MenuItems");

            migrationBuilder.DropColumn(
                name: "DishId",
                table: "MenuItems");

            migrationBuilder.CreateTable(
                name: "MenuItemDish",
                columns: table => new
                {
                    DishId = table.Column<int>(nullable: false),
                    MenuItemId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MenuItemDish", x => new { x.MenuItemId, x.DishId });
                    table.ForeignKey(
                        name: "FK_MenuItemDish_Dishes_DishId",
                        column: x => x.DishId,
                        principalTable: "Dishes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MenuItemDish_MenuItems_MenuItemId",
                        column: x => x.MenuItemId,
                        principalTable: "MenuItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MenuItemDish_DishId",
                table: "MenuItemDish",
                column: "DishId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MenuItemDish");

            migrationBuilder.AddColumn<int>(
                name: "DishId",
                table: "MenuItems",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_MenuItems_DishId",
                table: "MenuItems",
                column: "DishId");

            migrationBuilder.AddForeignKey(
                name: "FK_MenuItems_Dishes_DishId",
                table: "MenuItems",
                column: "DishId",
                principalTable: "Dishes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
