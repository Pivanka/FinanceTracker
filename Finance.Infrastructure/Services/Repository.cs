using System.Linq.Expressions;
using Finance.Application.Common.Interfaces;
using Finance.Domain.Common;
using Finance.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Finance.Infrastructure.Services;

public class Repository<TEntity> : IRepository<TEntity> 
        where TEntity : BaseEntity
{
    private readonly DataContext _dbContext;
    private readonly DbSet<TEntity> _dbSet;

    public Repository(DataContext dbContext)
    {
        _dbContext = dbContext;
        _dbSet = _dbContext.Set<TEntity>();
    }

    public async Task<TEntity?> GetById(int id, CancellationToken ct)
    {
        return await _dbSet.FindAsync([id], cancellationToken: ct);
    }

    public IQueryable<TEntity> Query(params Expression<Func<TEntity, object>>[] includes)
    {
        var dbSet = _dbContext.Set<TEntity>();
        var query = includes
            .Aggregate<Expression<Func<TEntity, object>>, IQueryable<TEntity>>(dbSet, (current, include) => current.Include(include));

        return query ?? dbSet;
    }

    public async Task<IEnumerable<TEntity>> GetAll(CancellationToken ct)
    {
        return await _dbSet.ToListAsync(ct);
    }

    public async Task<TEntity?> FirstOrDefault(Expression<Func<TEntity, bool>> predicate, CancellationToken ct)
    {
        return await _dbSet.FirstOrDefaultAsync(predicate, ct);
    }

    public async Task<TEntity> Add(TEntity entity, CancellationToken ct)
    {
        return (await _dbSet.AddAsync(entity, ct)).Entity;
    }

    public async Task Add(IEnumerable<TEntity> entities, CancellationToken ct)
    {
        await _dbSet.AddRangeAsync(entities, ct);
    }

    public async Task<TEntity> Update(TEntity entity, CancellationToken ct)
    {
        return await Task.Run(() => _dbSet.Update(entity).Entity, ct);
    }

    public async Task<int> Delete(TEntity entity, CancellationToken ct)
    {
        return await Task.Run(() => _dbSet.Remove(entity).Entity.Id, ct);
    }
}