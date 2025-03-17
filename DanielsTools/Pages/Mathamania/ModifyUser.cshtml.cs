using DanielsTools.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace DanielsTools.Pages.Mathamania
{
    public class ModifyUserModel : PageModel
    {
        public List<Emoji> EmojiList { get; set; }

        public Dictionary<int, string> EmojiDictionary { get; set; }


        public List<string> Colors { get; set; }
        public void OnGet()
        {
            EmojiList = EmojisHelper.ParseEmojis();
            Colors = ColorUtility.ColorChocies;

            EmojiDictionary = new Dictionary<int, string>();
            foreach (var emoji in EmojiList)
            {
                EmojiDictionary[emoji.Id] = emoji.Code;
            }
        }
    }
}
