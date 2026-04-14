using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bangla_Bazar.Server.Migrations
{
    /// <inheritdoc />
    public partial class MessageUpdate2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Massages_Users_ReceiverId",
                table: "Massages");

            migrationBuilder.DropForeignKey(
                name: "FK_Massages_Users_SenderId",
                table: "Massages");

            migrationBuilder.AddForeignKey(
                name: "FK_Massages_Users_ReceiverId",
                table: "Massages",
                column: "ReceiverId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Massages_Users_SenderId",
                table: "Massages",
                column: "SenderId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Massages_Users_ReceiverId",
                table: "Massages");

            migrationBuilder.DropForeignKey(
                name: "FK_Massages_Users_SenderId",
                table: "Massages");

            migrationBuilder.AddForeignKey(
                name: "FK_Massages_Users_ReceiverId",
                table: "Massages",
                column: "ReceiverId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Massages_Users_SenderId",
                table: "Massages",
                column: "SenderId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
