using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bangla_Bazar.Server.Migrations
{
    /// <inheritdoc />
    public partial class MessageUpdate1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Massages_Users_UserId",
                table: "Massages");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Massages",
                newName: "SenderId");

            migrationBuilder.RenameColumn(
                name: "Massages",
                table: "Massages",
                newName: "Content");

            migrationBuilder.RenameIndex(
                name: "IX_Massages_UserId",
                table: "Massages",
                newName: "IX_Massages_SenderId");

            migrationBuilder.AddColumn<bool>(
                name: "IsRead",
                table: "Massages",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ReceiverId",
                table: "Massages",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.Sql(@"
                DECLARE @FallbackUserId INT = (SELECT TOP (1) Id FROM Users ORDER BY Id);

                IF @FallbackUserId IS NULL
                BEGIN
                    THROW 50000, 'Unable to migrate Massages because no Users rows exist to satisfy the foreign keys.', 1;
                END;

                UPDATE m
                SET
                    m.SenderId = CASE
                        WHEN EXISTS (SELECT 1 FROM Users u WHERE u.Id = m.SenderId) THEN m.SenderId
                        ELSE @FallbackUserId
                    END,
                    m.ReceiverId = CASE
                        WHEN EXISTS (SELECT 1 FROM Users u WHERE u.Id = m.ReceiverId) THEN m.ReceiverId
                        WHEN EXISTS (SELECT 1 FROM Users u WHERE u.Id = m.SenderId) THEN m.SenderId
                        ELSE @FallbackUserId
                    END
                FROM Massages m
                WHERE NOT EXISTS (SELECT 1 FROM Users u WHERE u.Id = m.SenderId)
                   OR NOT EXISTS (SELECT 1 FROM Users u WHERE u.Id = m.ReceiverId);
            ");

            migrationBuilder.AddColumn<DateTime>(
                name: "SentAt",
                table: "Massages",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateIndex(
                name: "IX_Massages_ReceiverId",
                table: "Massages",
                column: "ReceiverId");

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

            migrationBuilder.DropIndex(
                name: "IX_Massages_ReceiverId",
                table: "Massages");

            migrationBuilder.DropColumn(
                name: "IsRead",
                table: "Massages");

            migrationBuilder.DropColumn(
                name: "ReceiverId",
                table: "Massages");

            migrationBuilder.DropColumn(
                name: "SentAt",
                table: "Massages");

            migrationBuilder.RenameColumn(
                name: "SenderId",
                table: "Massages",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "Content",
                table: "Massages",
                newName: "Massages");

            migrationBuilder.RenameIndex(
                name: "IX_Massages_SenderId",
                table: "Massages",
                newName: "IX_Massages_UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Massages_Users_UserId",
                table: "Massages",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
