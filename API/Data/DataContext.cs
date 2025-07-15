using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext(DbContextOptions options) : DbContext(options)
    {
        public DbSet<AppUser> Users { get; set; }
        public DbSet<UserLike> Likes { get; set; }
        public DbSet<Complex> Complexes { get; set; }
        public DbSet<Owner> Owners { get; set; }
        public DbSet<Tenant> Tenants { get; set; }
        public DbSet<Unit> Units { get; set; }
        public DbSet<UnitOwner> UnitOwners { get; set; }
        public DbSet<UnitType> UnitTypes { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<UnitOwner>()
                  .HasKey(bc => new { bc.UnitId, bc.OwnerId });


            builder.Entity<UnitOwner>()
                    .HasOne(bc => bc.Unit)
                    .WithMany(b => b.UnitOwners)
                    .HasForeignKey(bc => bc.UnitId);

            builder.Entity<UnitOwner>()
                    .HasOne(bc => bc.Owner)
                    .WithMany(c => c.UnitOwners)
                    .HasForeignKey(bc => bc.OwnerId);

            builder.Entity<UserLike>()
                .HasKey(k => new { k.SourceUserId, k.TargetUserId });

            builder.Entity<UserLike>()
                .HasOne(s => s.SourceUser)
                .WithMany(l => l.LikedUsers)
                .HasForeignKey(s => s.SourceUserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<UserLike>()
                .HasOne(s => s.TargetUser)
                .WithMany(l => l.LikedByUsers)
                .HasForeignKey(s => s.TargetUserId)
                .OnDelete(DeleteBehavior.Cascade);
        }


    }
}