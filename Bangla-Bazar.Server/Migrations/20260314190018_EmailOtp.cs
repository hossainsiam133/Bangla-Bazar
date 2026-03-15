using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bangla_Bazar.Server.Migrations
{
    /// <inheritdoc />
    public partial class EmailOtp : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "OtpCodes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsUsed",
                table: "OtpCodes",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Email",
                table: "OtpCodes");

            migrationBuilder.DropColumn(
                name: "IsUsed",
                table: "OtpCodes");
        }
    }
}
