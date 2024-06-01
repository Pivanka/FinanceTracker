using System.Linq.Expressions;
using Finance.Domain.Common;

namespace Finance.Application.Common.Interfaces;

public interface IRepository<TEntity> where TEntity : BaseEntity
{
    Task<TEntity?> GetById(int id, CancellationToken ct);
    IQueryable<TEntity> Query(params Expression<Func<TEntity, object>>[] includes);
    Task<IEnumerable<TEntity>> GetAll(CancellationToken ct);
    Task<TEntity?> FirstOrDefault(Expression<Func<TEntity, bool>> predicate, CancellationToken ct);
    Task<TEntity> Add(TEntity entity, CancellationToken ct);
    Task Add(IEnumerable<TEntity> entities, CancellationToken ct);
    Task<TEntity> Update(TEntity entity, CancellationToken ct);
    Task<int> Delete(TEntity entity, CancellationToken ct);
}