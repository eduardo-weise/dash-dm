using daily.presenter.Models;

namespace daily.presenter.Rules;

public static class PresenterRules
{
    public static PresenterState ApplyRotation(PresenterState state)
    {
        if (state.Names.Count == 0)
            return state;

        state.Names = state.Names
            .OrderBy(n => n, StringComparer.OrdinalIgnoreCase)
            .ToList();

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var lastDate = DateOnly.Parse(state.LastAdvancedDate);

        if (today <= lastDate)
            return state;

        int businessDays = CountBusinessDays(lastDate, today);

        if (businessDays > 0)
        {
            state.CurrentIndex = (state.CurrentIndex + businessDays) % state.Names.Count;
            state.LastAdvancedDate = today.ToString("yyyy-MM-dd");
        }

        return state;
    }

    public static void Skip(PresenterState state)
    {
        if (state.Names.Count == 0)
            return;

        state.CurrentIndex = (state.CurrentIndex + 1) % state.Names.Count;
        state.LastAdvancedDate = DateOnly.FromDateTime(DateTime.UtcNow).ToString("yyyy-MM-dd");
    }

    private static int CountBusinessDays(DateOnly from, DateOnly to)
    {
        int count = 0;
        var current = from.AddDays(1);

        while (current <= to)
        {
            if (current.DayOfWeek is not DayOfWeek.Saturday and not DayOfWeek.Sunday)
                count++;

            current = current.AddDays(1);
        }

        return count;
    }
}
