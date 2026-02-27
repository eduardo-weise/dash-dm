namespace daily.presenter.Models;

public class PresenterState
{
    public List<string> Names { get; set; } = [];
    public int CurrentIndex { get; set; } = 0;
    public string LastAdvancedDate { get; set; } = DateOnly.FromDateTime(DateTime.UtcNow).ToString("yyyy-MM-dd");
}
