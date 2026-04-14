using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bangla_Bazar.Server.Migrations
{
    /// <inheritdoc />
    public partial class MessageUpdate3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Replies",
                table: "Massages",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Replies",
                table: "Massages");
        }
    }
}
