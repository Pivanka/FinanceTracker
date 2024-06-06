using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Finance.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_CustomCategories_IsDeleted",
                table: "CustomCategories");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_Amount_Currency_Date_Type",
                table: "Transactions",
                columns: new[] { "Amount", "Currency", "Date", "Type" });

            migrationBuilder.CreateIndex(
                name: "IX_Teams_Currency",
                table: "Teams",
                column: "Currency");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_CreatedDate_Message_IsRead",
                table: "Notifications",
                columns: new[] { "CreatedDate", "Message", "IsRead" });

            migrationBuilder.CreateIndex(
                name: "IX_CustomCategories_IsDeleted_Title",
                table: "CustomCategories",
                columns: new[] { "IsDeleted", "Title" });

            migrationBuilder.CreateIndex(
                name: "IX_Categories_Title",
                table: "Categories",
                column: "Title");

            migrationBuilder.CreateIndex(
                name: "IX_Accounts_Title_IsDeleted",
                table: "Accounts",
                columns: new[] { "Title", "IsDeleted" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Users_Email",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Transactions_Amount_Currency_Date_Type",
                table: "Transactions");

            migrationBuilder.DropIndex(
                name: "IX_Teams_Currency",
                table: "Teams");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_CreatedDate_Message_IsRead",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_CustomCategories_IsDeleted_Title",
                table: "CustomCategories");

            migrationBuilder.DropIndex(
                name: "IX_Categories_Title",
                table: "Categories");

            migrationBuilder.DropIndex(
                name: "IX_Accounts_Title_IsDeleted",
                table: "Accounts");

            migrationBuilder.CreateIndex(
                name: "IX_CustomCategories_IsDeleted",
                table: "CustomCategories",
                column: "IsDeleted");
        }
    }
}
